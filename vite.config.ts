import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages はリポジトリ名のサブパスで配信されるため相対パスにする
export default defineConfig({ base: "./", plugins: [react()] });
