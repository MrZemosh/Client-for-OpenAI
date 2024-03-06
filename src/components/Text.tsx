import { FC } from "react"
import { LANG_CS } from "../lang/cs"
import { LANG_EN } from "../lang/en"

type TextProps = {
  children: any
}

export const Text: FC<TextProps> = ({ children }) => {
  const currentLanguage = localStorage.getItem("lang") ?? "cs"
  const selected = currentLanguage === "cs" ? (LANG_CS as any)[children] : (LANG_EN as any)[children]
  return selected
}
export const TextRaw = (value: string) => {
  const currentLanguage = localStorage.getItem("lang") ?? "cs"
  const selected = currentLanguage === "cs" ? (LANG_CS as any)[value] : (LANG_EN as any)[value]
  return selected
}