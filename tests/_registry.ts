import { TestRegistry } from "@/engines/core/types";
import { familyOriginTest } from "./family-origin/config";

export const registry = new TestRegistry();

registry.register(familyOriginTest);

export const getAllTests = () => registry.list();
export const getTest = (slug: string) => registry.get(slug);
export const hasTest = (slug: string) => registry.has(slug);
