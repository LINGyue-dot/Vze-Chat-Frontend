import { compile, ComponentPublicInstance, h } from "vue";

export function installQucickPreview(app: ComponentPublicInstance<any>) {
  app.component("quick-preview", {
    props: ["code"],
    render() {
      return h(compile(this.code));
    },
  });
}
