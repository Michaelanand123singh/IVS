import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="#" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Integrated Value Solutions"
            width={160}
            height={45}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-6 md:flex text-sm font-medium">
          <a href="#services" className="text-gray-600 transition-colors hover:text-gray-900">Services</a>
          <a href="#about" className="text-gray-600 transition-colors hover:text-gray-900">About</a>
          <a href="#testimonials" className="text-gray-600 transition-colors hover:text-gray-900">Testimonials</a>
          <a href="#contact" className="text-gray-600 transition-colors hover:text-gray-900">Contact</a>
          <a href="#contact" className="rounded-md bg-[#1F4E79] px-5 py-2 text-white font-semibold transition-all hover:bg-[#1a4268] hover:shadow-md">
            Get a Quote
          </a>
        </nav>
      </div>
    </header>
  );
}


