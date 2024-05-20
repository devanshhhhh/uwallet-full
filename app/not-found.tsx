export default function Error() {
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center text-white bg-[#313638]">
      <h1 className="text-7xl font-bold">404</h1>
      <p>
        We haven&apos;t made this route yet, perhaps you can find what you need
        at
      </p>
      <a href="/" className="underline text-slate-500">
        UWallet
      </a>
    </div>
  );
}
