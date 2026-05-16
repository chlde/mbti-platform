// Allow importing CSS files without type errors
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
