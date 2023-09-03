// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import { Sidebar } from "./components/Sidebar";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Lolbets</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-custom-blue-100">
        <Suspense>
          <ErrorBoundary>
            {/* <div class="flex h-screen bg-custom-blue-100">
              <Sidebar /> */}
              <Routes>
                <FileRoutes />
              </Routes>
            {/* </div> */}
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
