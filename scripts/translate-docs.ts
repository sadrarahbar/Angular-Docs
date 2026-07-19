// scripts/translate-docs.ts

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

const sourceDirectory = path.join(process.cwd(), "app/content/en");
const targetDirectory = path.join(process.cwd(), "app/content/fa");
const cachePath = path.join(targetDirectory, ".translation-hashes.json");
const forceTranslate = process.argv.includes("--force");
const skipOnQuota = process.argv.includes("--skip-on-quota");

type TranslationProvider = "openai" | "gemini";

type TranslationCacheEntry = {
  sourceHash: string;
  targetHash: string;
  translatedAt: string;
  model: string;
};

type TranslationCache = {
  version: 1;
  files: Record<string, TranslationCacheEntry>;
};

type ProtectedMarkdown = {
  markdown: string;
  placeholders: Map<string, string>;
};

const translationInstructions = `
You are a professional Persian technical writer and software documentation
translator.

Translate the supplied English Markdown into natural and fluent Persian
for Iranian software developers.

Rules:
- Translate by meaning, not word by word.
- Preserve Markdown structure.
- Do not translate commands, URLs, paths, package names, API names,
  variable names, component names, or identifiers.
- Keep placeholders such as __PROTECTED_BLOCK_0__ exactly as they are.
- Preserve frontmatter keys.
- Translate frontmatter values such as title and description.
- Translate human-readable values in Angular docs tags, such as title,
  headerTitle, description, and link.
- Do not add new information.
- Return only the translated Markdown.

Glossary:
- Angular: Angular
- component: کامپوننت
- components: کامپوننت‌ها
- signal: Signal
- signals: Signalها
- template: template
- dependency injection: Dependency Injection
- routing: routing
- server-side rendering: server-side rendering
- hydration: hydration
- directive: directive
- pipe: pipe
- service: service
- guard: guard
- resolver: resolver
`;

async function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");

  try {
    const env = await fs.readFile(envPath, "utf8");

    for (const line of env.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }
}

function createClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env or export it before running docs:translate.");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function getTranslationProvider(): TranslationProvider {
  const providerArg = process.argv
    .find((arg) => arg.startsWith("--provider="))
    ?.slice("--provider=".length)
    .toLowerCase();
  const provider = providerArg ?? process.env.TRANSLATION_PROVIDER?.toLowerCase();

  if (provider === "openai" || provider === "gemini") {
    return provider;
  }

  if (process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    return "gemini";
  }

  return "openai";
}

function getTranslationModel(provider: TranslationProvider) {
  if (provider === "gemini") {
    return process.env.GEMINI_TRANSLATION_MODEL ?? "gemini-2.5-flash";
  }

  return process.env.OPENAI_TRANSLATION_MODEL ?? "gpt-5-mini";
}

function createHash(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function protectMarkdown(markdown: string): ProtectedMarkdown {
  const placeholders = new Map<string, string>();
  let index = 0;

  const protect = (value: string) => {
    const placeholder = `__PROTECTED_BLOCK_${index}__`;
    index += 1;
    placeholders.set(placeholder, value);
    return placeholder;
  };

  let protectedMarkdown = markdown;

  protectedMarkdown = protectedMarkdown.replace(
    /<docs-code-multifile\b[^>]*>[\s\S]*?<\/docs-code-multifile>/g,
    protect,
  );
  protectedMarkdown = protectedMarkdown.replace(/<docs-code\b[^>]*>[\s\S]*?<\/docs-code>/g, protect);
  protectedMarkdown = protectedMarkdown.replace(/<docs-code\b[^>]*\/>/g, protect);
  protectedMarkdown = protectedMarkdown.replace(/```[\s\S]*?```/g, protect);
  protectedMarkdown = protectedMarkdown.replace(/`[^`\n]+`/g, protect);

  return {
    markdown: protectedMarkdown,
    placeholders,
  };
}

function restoreMarkdown(protectedMarkdown: ProtectedMarkdown, translatedMarkdown: string) {
  let restoredMarkdown = translatedMarkdown;

  for (const [placeholder, originalContent] of protectedMarkdown.placeholders) {
    if (!restoredMarkdown.includes(placeholder)) {
      throw new Error(`The translation response did not preserve placeholder ${placeholder}.`);
    }

    restoredMarkdown = restoredMarkdown.replaceAll(placeholder, originalContent);
  }

  return restoredMarkdown;
}

function isInsufficientQuotaError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "code" in error &&
    error.status === 429 &&
    error.code === "insufficient_quota"
  );
}

async function loadTranslationCache(): Promise<TranslationCache> {
  try {
    const cache = JSON.parse(await fs.readFile(cachePath, "utf8")) as TranslationCache;

    return {
      version: 1,
      files: cache.files ?? {},
    };
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return {
        version: 1,
        files: {},
      };
    }

    throw error;
  }
}

async function saveTranslationCache(cache: TranslationCache) {
  await fs.mkdir(path.dirname(cachePath), {
    recursive: true,
  });

  const orderedFiles = Object.fromEntries(
    Object.entries(cache.files).sort(([left], [right]) => left.localeCompare(right)),
  );

  await fs.writeFile(
    cachePath,
    `${JSON.stringify({ ...cache, files: orderedFiles }, null, 2)}\n`,
    "utf8",
  );
}

async function getMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(fullPath);
      }

      if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

async function translateWithOpenAI(client: OpenAI, model: string, markdown: string): Promise<string> {
  const protectedMarkdown = protectMarkdown(markdown);
  const response = await client.responses.create({
    model,
    instructions: translationInstructions,
    input: protectedMarkdown.markdown,
  });

  const translatedText = response.output_text.trim();

  if (!translatedText) {
    throw new Error("The translation response was empty.");
  }

  return restoreMarkdown(protectedMarkdown, translatedText);
}

async function translateWithGemini(model: string, markdown: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Add it to .env or set TRANSLATION_PROVIDER=openai.");
  }

  const protectedMarkdown = protectMarkdown(markdown);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: translationInstructions,
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: protectedMarkdown.markdown,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    const hint =
      response.status === 403
        ? "Check that the Gemini API key is from Google AI Studio, the Generative Language API is enabled for its project, API key restrictions allow this API, and your current network can access the Gemini API."
        : "Check the Gemini API key, model name, quota, and request details.";

    throw new Error(`Gemini request failed with ${response.status}. ${hint}\n${errorText}`);
  }

  const data = (await response.json()) as {
    candidates?: {
      content?: {
        parts?: {
          text?: string;
        }[];
      };
    }[];
  };
  const translatedText = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();

  if (!translatedText) {
    throw new Error("The Gemini translation response was empty.");
  }

  return restoreMarkdown(protectedMarkdown, translatedText);
}

async function translateMarkdown(
  provider: TranslationProvider,
  model: string,
  client: OpenAI | undefined,
  markdown: string,
): Promise<string> {
  if (provider === "gemini") {
    return translateWithGemini(model, markdown);
  }

  if (!client) {
    throw new Error("OpenAI client was not initialized.");
  }

  return translateWithOpenAI(client, model, markdown);
}

async function main() {
  await loadEnvFile();
  await fs.mkdir(targetDirectory, {
    recursive: true,
  });

  const cache = await loadTranslationCache();
  const files = await getMarkdownFiles(sourceDirectory);
  const currentRelativePaths = new Set<string>();
  let provider = getTranslationProvider();
  let translationModel = getTranslationModel(provider);
  let cacheModel = `${provider}:${translationModel}`;
  let client: OpenAI | undefined;

  let translatedCount = 0;
  let skippedCount = 0;
  let indexedCount = 0;

  for (const sourcePath of files) {
    const relativePath = path.relative(sourceDirectory, sourcePath);
    const targetPath = path.join(targetDirectory, relativePath);
    currentRelativePaths.add(relativePath);

    const sourceMarkdown = await fs.readFile(sourcePath, "utf8");
    const sourceHash = createHash(sourceMarkdown);
    const cachedTranslation = cache.files[relativePath];

    try {
      const targetMarkdown = await fs.readFile(targetPath, "utf8");
      const targetHash = createHash(targetMarkdown);

      if (!forceTranslate && cachedTranslation?.sourceHash === sourceHash) {
        if (cachedTranslation.targetHash !== targetHash) {
          cache.files[relativePath] = {
            ...cachedTranslation,
            targetHash,
          };
          await saveTranslationCache(cache);
        }

        skippedCount += 1;
        console.log(`Skipped unchanged: ${relativePath}`);
        continue;
      }

      if (!forceTranslate && !cachedTranslation) {
        cache.files[relativePath] = {
          sourceHash,
          targetHash,
          translatedAt: new Date().toISOString(),
          model: "existing",
        };
        await saveTranslationCache(cache);

        indexedCount += 1;
        console.log(`Indexed existing translation: ${relativePath}`);
        continue;
      }
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code !== "ENOENT") {
        throw error;
      }
    }

    if (provider === "openai") {
      client ??= createClient();
    }

    let translatedMarkdown: string;

    try {
      translatedMarkdown = await translateMarkdown(provider, translationModel, client, sourceMarkdown);
    } catch (error) {
      if (provider === "openai" && process.env.GEMINI_API_KEY && isInsufficientQuotaError(error)) {
        provider = "gemini";
        translationModel = getTranslationModel(provider);
        cacheModel = `${provider}:${translationModel}`;
        console.warn("OpenAI quota is exhausted. Falling back to Gemini for remaining translations.");
        translatedMarkdown = await translateMarkdown(provider, translationModel, undefined, sourceMarkdown);
      } else if (skipOnQuota && isInsufficientQuotaError(error)) {
        console.warn(
          `OpenAI quota is exhausted. Skipping new translations after ${relativePath}. Existing Persian files will still be used.`,
        );
        break;
      } else {
        throw error;
      }
    }

    await fs.mkdir(path.dirname(targetPath), {
      recursive: true,
    });

    await fs.writeFile(targetPath, translatedMarkdown, "utf8");

    cache.files[relativePath] = {
      sourceHash,
      targetHash: createHash(translatedMarkdown),
      translatedAt: new Date().toISOString(),
      model: cacheModel,
    };
    await saveTranslationCache(cache);

    translatedCount += 1;
    console.log(`Translated: ${relativePath}`);
  }

  for (const relativePath of Object.keys(cache.files)) {
    if (!currentRelativePaths.has(relativePath)) {
      delete cache.files[relativePath];
    }
  }

  await saveTranslationCache(cache);

  console.log(
    `Done. Translated: ${translatedCount}, skipped: ${skippedCount}, indexed existing: ${indexedCount}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
