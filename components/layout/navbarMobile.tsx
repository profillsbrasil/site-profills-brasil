import logoProfills from "@/public/logo-branco.png";
import Image from "next/image";

export default function NavbarMobile() {
  return (
    <div className="border-border/10 fixed top-0 z-50 flex h-16 w-full border-b bg-slate-900 md:hidden">
      <div className="flex h-full w-full items-center justify-center">
        <Image
          src={logoProfills}
          alt="Logo Profills"
          className="h-10 w-auto object-contain"
        />
      </div>
    </div>
  );
}
