export type Block = {
  id: string,
  type: string,
  props: Record<string, boolean | number | string>,
  content: InlineContent[] | TableContent | undefined,
  children: Block[],
};

export type ColumnBlock = {
  id: string,
  type: "column",
  props: { width: number },
  content: undefined,
  children: Block[],
};

export type ColumnListBlock = {
  id: string,
  type: "columnList",
  props: {},
  content: undefined,
  children: ColumnBlock[],
};

export type ParagraphBlock = {
  id: string,
  type: "paragraph",
  props: DefaultProps,
  content: InlineContent[],
  children: Block[],
};

export type HeadingBlock = {
  id: string,
  type: "heading",
  props: {
    level: 1 | 2 | 3,
  } & DefaultProps,
  content: InlineContent[],
  children: Block[],
};

export type BulletListItemBlock = {
  id: string,
  type: "bulletListItem",
  props: DefaultProps,
  content: InlineContent[],
  children: Block[],
};

export type NumberedListItemBlock = {
  id: string,
  type: "numberedListItem",
  props: DefaultProps,
  content: InlineContent[],
  children: Block[],
};

export type ImageBlock = {
  id: string,
  type: "image",
  props: {
    url: string,
    caption: string,
    previewWidth: number,
  } & DefaultProps,
  content: undefined,
  children: Block[],
};

export type TableBlock = {
  id: string,
  type: "table",
  props: DefaultProps,
  content: TableContent,
  children: Block[],
};

export type DefaultProps = {
  backgroundColor: string,
  textColor: string,
  textAlignment: "left" | "center" | "right" | "justify",
};

export type StyledText = {
  type: "text",
  text: string,
  styles: Styles,
};

export type Link = {
  type: "link",
  content: StyledText[],
  href: string,
};

export type Styles = {
  bold: boolean,
  italic: boolean,
  underline: boolean,
  strikethrough: boolean,
  textColor: string,
  backgroundColor: string,
};

export type InlineContent = Link | StyledText;

export type TableContent = {
  type: "tableContent",
  rows: {
    cells: InlineContent[][],
  }[],
};
