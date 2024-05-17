import "../static/css/section.css";

const SectionLayout = ({ title, subtitle, children }) => {
  return (
    <section className="section pt-24">
      <h1 class="uppercase mb-4 text-base font-bold leading-none tracking-tight text-slate-700 md:text-1xl lg:text-3xl dark:text-white">
       {title}
      </h1>
      <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
        {subtitle}
      </p>
      <div className="content">{children}</div>
    </section>
  );
};

export default SectionLayout;
