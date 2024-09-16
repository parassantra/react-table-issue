import React, { useState, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ResizableTable from "./components/ResizeableTable";
import PopoutWindow from "./components/PopoutWidow";
import "./styles.css";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
};

const data: Person[] = [
  { firstName: "John", lastName: "Doe", age: 30 },
  { firstName: "Jane", lastName: "Smith", age: 25 },
  { firstName: "Bob", lastName: "Johnson", age: 45 },
];

const columns: ColumnDef<Person>[] = [
  { header: "First Name", accessorKey: "firstName" },
  { header: "Last Name", accessorKey: "lastName" },
  { header: "Age", accessorKey: "age" },
];

export default function App() {
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const popoutDocumentRef = useRef<Document | null>(null);

  const openPopout = () => setIsPopoutOpen(true);
  const closePopout = () => {
    setIsPopoutOpen(false);
    popoutDocumentRef.current = null;
  };

  const setPopoutDocument = (doc: Document) => {
    popoutDocumentRef.current = doc;
  };

  return (
    <div className="App">
      <h1>Resizable Table Example</h1>
      {!isPopoutOpen && <ResizableTable data={data} columns={columns} />}
      <br />
      <button onClick={openPopout}>
        {isPopoutOpen ? "Open New Popout" : "Open Table in Popout"}
      </button>
      {isPopoutOpen && (
        <PopoutWindow closeWindow={closePopout} setPopoutDocument={setPopoutDocument}>
          <h2>Resizable Table in Popout Window</h2>
          <ResizableTable 
            data={data} 
            columns={columns} 
            popoutDocument={popoutDocumentRef.current ?? undefined}
          />
        </PopoutWindow>
      )}
    </div>
  );
}
