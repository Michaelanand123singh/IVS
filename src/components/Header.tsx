import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#" className="text-xl font-semibold tracking-tight text-gray-900">
          Integrated Value Solutions
        </Link>
        <nav className="hidden items-center gap-8 md:flex text-sm text-gray-700">
          <a href="#services" className="transition-colors hover:text-gray-900">Services</a>
          <a href="#about" className="transition-colors hover:text-gray-900">About</a>
          <a href="#testimonials" className="transition-colors hover:text-gray-900">Testimonials</a>
          <a href="#contact" className="transition-colors hover:text-gray-900">Contact</a>
          <a href="#contact" className="rounded-md bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-black">Get a quote</a>
        </nav>
      </div>
    </header>
  );
}


