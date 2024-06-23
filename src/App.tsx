import { useEffect, useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";

function App() {
  const [initialValue, setInitialValue] = useState(`{
  "id": 1,
  "name": "Zatt",
  "password": "123abc",
  "email": "zatt@zatt.com",
  "age": 25,
  "friends": ["Zach", "Zack", "Zain"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": 10001
  }
}`);
  const [copied, setCopied] = useState(false);
  const [onError, setOnError] = useState(false);
  const [validated, setvalidated] = useState(true);
  const [interfaceName, setInterfaceName] = useState("UserModel");
  const [outputValue, setOutputValue] = useState("");

  const handleEditorChange = (value: any) => {
    setInitialValue(value);
  };

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(outputValue);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  function generateInterface(obj: any): string {
    const isArray = Array.isArray(obj);

    if (isArray) {
      const arrayType =
        obj.length > 0
          ? Array.isArray(obj[0])
            ? generateInterface(obj[0])
            : typeof obj[0]
          : "any";
      return `${arrayType}[]`;
    }

    const interfaceProperties = Object.entries(obj)
      .map(([key, value]) => {
        let type: string;

        if (Array.isArray(value)) {
          type = generateInterface(value);
        } else if (value instanceof Date) {
          type = "Date";
        } else if (typeof value === "object" && value !== null) {
          type = generateInterface(value);
        } else {
          type = typeof value;
        }

        return `${key}: ${type};`;
      })
      .join("\n  ");

    return `{\n  ${interfaceProperties}\n}`;
  }

  const generate = (e: any = null) => {
    e && e.preventDefault();
    if (!onError) {
      const interfaceString = generateInterface(JSON.parse(initialValue));
      setOutputValue(`export interface ${interfaceName} ${interfaceString}`);
    }
  };
  useEffect(() => {
    generate();
  }, []);

  return (
    <div id="App">
      <aside id="input">
        <form className="type-container" onSubmit={generate}>
          <label htmlFor="typeName" className="type-label">
            Nombre
          </label>
          <div className="input-content">
            <input
              required
              type="text"
              placeholder="UserModel"
              className="type-input"
              value={interfaceName}
              onChange={(e) => setInterfaceName(e.target.value)}
            />
            <button
              disabled={!validated}
              className="input-button"
              type="submit"
            >
              Generar
            </button>
            <p className="input-format">Tipo ( JSON )</p>
          </div>
        </form>
        <Editor
          width="100%"
          height="100%"
          language="javascript"
          defaultLanguage="json"
          theme="vs-dark"
          defaultValue={initialValue}
          value={initialValue}
          onChange={handleEditorChange}
          onValidate={(e) => {
            setvalidated(e.length <= 0 ?? true);
            setOnError(e.length > 0);
          }}
          options={{
            lineHeight: 20,
            lineNumbers: "off",
            lineDecorationsWidth: 0,
            renderLineHighlight: "none",
            minimap: { enabled: false },
            formatOnType: true,
            formatOnPaste: true,
            bracketPairColorization: {
              enabled: true,
            },
            scrollbar: {
              vertical: "hidden",
              horizontalScrollbarSize: 5,
              verticalScrollbarSize: 0,
            },
          }}
        />
      </aside>
      <section id="output">
        <h1 className="output-title">Output</h1>
        {outputValue && (
          <div className="output-content">
            <Editor
              width="100%"
              height="100%"
              language="typescript"
              defaultLanguage="typescript"
              theme="vs-dark"
              defaultValue={outputValue}
              value={outputValue}
              options={{
                lineHeight: 20,
                lineNumbers: "off",
                lineDecorationsWidth: 0,
                renderLineHighlight: "none",
                readOnly: true,
                minimap: { enabled: false },
                formatOnType: true,
                formatOnPaste: true,
                bracketPairColorization: {
                  enabled: true,
                },
                scrollbar: {
                  vertical: "hidden",
                  horizontalScrollbarSize: 5,
                  verticalScrollbarSize: 0,
                },
              }}
            />
            <button
              disabled={copied}
              onClick={copyToClipboard}
              className={`copy-button ${copied && "copied"}`}
            >
              Copy
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
