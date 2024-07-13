// INTEGRATE TAILWIND MERGE TO HANDLE CLASSES OVERRIDE ISSUE
export const merge_classes = (classes: string[]) => {
  return classes
    .map((class_str) => class_str.replace(/  +/g, " ").trim())
    .filter((str) => !!str)
    .join(" ");
};
