"use client";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function CardComponent(props: any) {
  const router = useRouter();

  function onclickhandler() {
    router.push(props.route);
  }

  return (
    <Card
      className="
        w-80 h-80 
        flex items-center justify-center 
        text-2xl font-semibold text-bold
        active:scale-95 active:blur-sm 
        hover:scale-105 hover:shadow-2xl hover:shadow-white/20
        transition-all 
        cursor-pointer
        bg-red backdrop-blur-sm
        borderborder-green/20
      "
      onClick={onclickhandler}
    >
      {props.title}
    </Card>
  );
}