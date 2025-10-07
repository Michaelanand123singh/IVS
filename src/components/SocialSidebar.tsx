import { FaLinkedin, FaXTwitter, FaGithub } from "react-icons/fa6";

export default function SocialSidebar() {
  return (
    <aside className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col items-center gap-3 rounded-full border border-gray-200 bg-white p-3 shadow-md">
        <a aria-label="LinkedIn" href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="text-gray-700 transition-colors hover:text-gray-900">
          <FaLinkedin size={20} />
        </a>
        <a aria-label="X" href="https://x.com" target="_blank" rel="noreferrer" className="text-gray-700 transition-colors hover:text-gray-900">
          <FaXTwitter size={20} />
        </a>
        <a aria-label="GitHub" href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-700 transition-colors hover:text-gray-900">
          <FaGithub size={20} />
        </a>
      </div>
    </aside>
  );
}


