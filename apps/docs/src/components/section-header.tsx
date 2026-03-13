type SectionHeaderProps = {
  number: string;
  title: string;
  description: string;
  color?: string;
};

export function SectionHeader(props: SectionHeaderProps) {
  const { number, title, description, color } = props;

  return (
    <header className="mb-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-gray-400">{number}</span>
        <h3 className="text-[14px] font-medium text-black">{title}</h3>
        {color && (
          <div
            className="size-2 shrink-0"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      <p className="mt-1 text-[13px] text-gray-500">{description}</p>
    </header>
  );
}
