"use client"

export default function Header() {
  return (
    <header className="sticky top-0 z-100 bg-[rgba(244,232,209,0.8)] backdrop-blur-md border-b border-[rgba(59,47,47,0.1)] py-4">
      <nav className="container mx-auto px-5 flex justify-between items-center max-w-6xl">
        <a href="#" className="font-serif font-semibold text-2xl text-[#A64029]">
          Kulineria
        </a>
        <ul className="hidden md:flex list-none m-0 p-0 gap-8">
          <li>
            <a href="#" className="no-underline text-[#6E5849] font-medium transition-colors hover:text-[#A64029]">
              Beranda
            </a>
          </li>
          <li>
            <a
              href="#"
              className="no-underline text-[#6E5849] font-medium active:text-[#A64029] transition-colors hover:text-[#A64029]"
            >
              Jelajah
            </a>
          </li>
          <li>
            <a href="#" className="no-underline text-[#6E5849] font-medium transition-colors hover:text-[#A64029]">
              Resep
            </a>
          </li>
          <li>
            <a href="#" className="no-underline text-[#6E5849] font-medium transition-colors hover:text-[#A64029]">
              Login
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
