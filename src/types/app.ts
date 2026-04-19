export type BackgroundOption = {
  id: string;
  label: string;
  fill: string;
  accent: string;
};

export type PromoTemplate = {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
};

export type EditorHookOptions = {
  backgrounds: BackgroundOption[];
  templates: PromoTemplate[];
};
