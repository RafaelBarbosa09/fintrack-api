import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    api: 5000,
    clearMocks: true,      // limpar mocks antes de cada teste
    globals: true,             // usar describe/it/expect sem importar
    environment: "node",       // backend (Prisma, APIs, etc.)
    include: ["src/**/*.spec.ts"], // arquivos de teste
    exclude: [
      "node_modules",
      "dist",
      "coverage",
      "prisma/**"              // exemplo: ignorar migrations
    ],
    coverage: {
      reporter: ["lcov", "text", "html"],
      include: [
        "src/**/*.usecase.ts",
        "src/**/*.controller.ts",
      ],
      thresholds: {
        statements: 80,
        functions: 80,
        branches: 80,
        lines: 80,
      },
    }
  },
});
