export function MarkdownPreview({ content }) {
  const lines = content.split("\n");
  const elements = [];
  let index = 0;
  let codeLines = [];
  let inCode = false;
  let tableRows = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows;
    tableRows = [];
    elements.push(
      <div key={`t${index}`} className="my-3 overflow-x-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {rows[0].map((cell, cellIndex) => (
                <th
                  key={cellIndex}
                  className="px-3 py-1.5 text-left font-semibold"
                  style={{ color: "#E6EDF3", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {cell.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(2).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-1.5"
                    style={{ color: "#8B949E", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const formatInline = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong style='color:#C9D1D9'>$1</strong>")
      .replace(/`(.*?)`/g, "<code style='color:#79C0FF;font-family:monospace;background:rgba(255,255,255,0.06);padding:1px 4px;border-radius:3px'>$1</code>");

  while (index < lines.length) {
    const line = lines[index];
    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(
          <pre
            key={`c${index}`}
            className="my-3 overflow-x-auto rounded-lg p-3 text-[10px] leading-relaxed"
            style={{
              background: "#0D1117",
              color: "#79C0FF",
              fontFamily: "monospace",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            {codeLines.join("\n")}
          </pre>
        );
        inCode = false;
        codeLines = [];
      } else {
        inCode = true;
      }
      index += 1;
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      index += 1;
      continue;
    }
    if (line.startsWith("|")) {
      tableRows.push(line.split("|").filter((_, cellIndex, array) => cellIndex > 0 && cellIndex < array.length - 1));
      index += 1;
      continue;
    }
    flushTable();
    if (line.startsWith("# ")) {
      elements.push(<h1 key={index} className="mb-3 mt-1 text-lg font-bold" style={{ color: "#E6EDF3" }}>{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={index} className="mb-2 mt-4 text-sm font-semibold" style={{ color: "#E6EDF3" }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={index} className="mb-1.5 mt-3 text-xs font-semibold" style={{ color: "#C9D1D9" }}>{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={index} className="my-2 pl-3 text-[11px] italic" style={{ borderLeft: "2px solid #3B82F6", color: "#8B949E" }}>
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.match(/^[-*] /)) {
      elements.push(
        <li
          key={index}
          className="my-0.5 ml-4 list-disc text-[11px]"
          style={{ color: "#8B949E" }}
          dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }}
        />
      );
    } else if (line.trim() === "") {
      elements.push(<div key={index} className="h-2" />);
    } else {
      elements.push(
        <p
          key={index}
          className="my-0.5 text-[11px] leading-relaxed"
          style={{ color: "#8B949E" }}
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    }
    index += 1;
  }

  flushTable();
  return <>{elements}</>;
}
