"use client";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { useServerInsertedHTML } from "next/navigation";
import { ReactNode, useState } from "react";

export default function AntdRegistry({ children }: { children: ReactNode }) {
  const [cache] = useState(() => {
    const antdCache = createCache();
    (antdCache as typeof antdCache & { compat?: boolean }).compat = true;
    return antdCache;
  });

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
