export default function Contact() {
  return (
    <section id="contact" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-gray-900">Contact</h2>
        <p className="mt-2 max-w-2xl text-gray-600">
          Tell us about your project. We usually respond within 1 business day.
        </p>
        <form className="mt-8 grid gap-4 sm:grid-cols-2">
          <input required placeholder="Name" className="rounded-md border border-gray-300 px-4 py-2 sm:col-span-1" />
          <input required type="email" placeholder="Email" className="rounded-md border border-gray-300 px-4 py-2 sm:col-span-1" />
          <input placeholder="Company" className="rounded-md border border-gray-300 px-4 py-2 sm:col-span-1" />
          <input placeholder="Budget" className="rounded-md border border-gray-300 px-4 py-2 sm:col-span-1" />
          <textarea required placeholder="Project details" rows={5} className="rounded-md border border-gray-300 px-4 py-2 sm:col-span-2" />
          <div className="sm:col-span-2">
            <button className="rounded-md bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-black">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}


