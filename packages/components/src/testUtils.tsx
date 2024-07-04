import * as testLib from "@testing-library/react";
import { act } from "react";

export { act };
export const { fireEvent, screen, waitFor, within, render, renderHook } = testLib;
