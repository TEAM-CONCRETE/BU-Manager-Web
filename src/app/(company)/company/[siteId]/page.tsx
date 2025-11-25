"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  params: { siteId: string };
};

export default function CompanySiteIndexPage({ params }: Props) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/company/${params.siteId}/dashboard`);
  }, [router, params.siteId]);

  return null;
}
