function Header() {
  return (
    <div className="relative z-2">
      {/* HEADER */}

      <header className="flex justify-between items-center p-2 bg-[#c5c5c5] px-6 md:px-10 lg:px-14">
        <div>
          <a>
            <img src="\assets\c6-logo.png" className="h-6"></img>
          </a>
        </div>
        <a
          href="https://www.aliestconexao.com.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="\assets\aliest-logo.png"
            className="h-10 hover:cursor-pointer"
          ></img>
        </a>
      </header>
    </div>
  );
}

export default Header;
