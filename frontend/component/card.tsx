"use client";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function CardComponent(props: any) {
  const router = useRouter();

  function onclickhandler() {
    router.push(props.route);
  }

  return (
    <>
      <Card
        className="active:scale-95 active:blur-sm transition cursor-pointer"
        onClick={onclickhandler}
      >
        {props.title}
      </Card>
    </>
  );
}
