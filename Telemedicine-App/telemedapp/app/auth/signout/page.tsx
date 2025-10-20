"use client";

import { useEffect } from "react";

function SignOut() {
  useEffect(() => {
    localStorage.clear();
    window.location.href = "/auth/signin";
  }, []);

  return <></>;
}

export default SignOut;
