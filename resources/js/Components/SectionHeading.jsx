export default function SectionHeading({ number, title }) {
    return (
        <div className="mt-8 flex items-center gap-3 border-b border-border pb-3 first:mt-0">
            {number && (
                <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-highlight px-2 text-xs font-semibold text-highlight-foreground">
                    {number}
                </span>
            )}
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
    );
}
