"use client";

import React, { useState, useEffect } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import DocumentComponent from "./DocumentComponent";
import SearchBar from "../SearchBar/searchbar";

const PatientDocuments = () => {
  const [documents, setDocuments] = React.useState<any[]>([]);
  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FaRegFilePdf className="w-10 h-10 text-neutral-600 p-2" />;
      case "image":
        return <FaRegImage className="w-10 h-10 text-neutral-600 p-2" />;
      case "link":
        return <FaLink className="w-10 h-10 text-neutral-600 p-2" />;
      default:
        return <FaRegFilePdf className="w-10 h-10 text-neutral-600 p-2" />;
    }
  };
  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:3000/documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDocuments();
  }, []);
  return (
    <div className="m-4 ">
      {documents.length > 0 ? (
        <div className="flex flex-col space-y-4 overflow-y-auto">
          <SearchBar placeholder="Document name" />
          {documents.map((document, index) => (
            <DocumentComponent
              key={index}
              document={document}
              icon={getIcon(document.type)}
            />
          ))}
        </div>
      ) : (
        <p className="font-semibold">You don't have any saved documents</p>
      )}
    </div>
  );
};

export default PatientDocuments;
