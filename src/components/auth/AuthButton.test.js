import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import { createServer } from "../../test/server";
import AuthButtons from "./AuthButtons";

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findAllByRole("link");
}

//IMPORTANT! if a run these two tests at the same time they will fail,
//I can use describe.only or test.only to run just one or I can set up a debugger
// by adding in my package.json a new script 'test:debug': 'react-scripts --inspect-brk test --runInBand --no-cache'
// and add in the js file the debugger
//To reset the SWR cache between tests cases you need to wrap the apllication with
// an empty cache provider => <SWRConfig value={{provider:() => new Map()}}> and close it </SWRConfig>

describe("when user is NOT SIGNED IN", () => {
  createServer([
    {
      path: "api/user",
      res: () => {
        return { user: null };
      },
    },
  ]),
    test("should show sign in and sign up buttons", async () => {
      await renderComponent();

      const signInButton = screen.getByRole("link", {
        name: /sign in/i,
      });

      const signUpButton = screen.getByRole("link", {
        name: /sign up/i,
      });

      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toHaveAttribute("href", "/signin");

      expect(signUpButton).toBeInTheDocument();
      expect(signUpButton).toHaveAttribute("href", "/signup");
    });

  test("sign out button should not be visible", async () => {
    await renderComponent();
    const signOutButton = screen.queryByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe("when user is SIGNED IN", () => {
  createServer([
    {
      path: "api/user",
      res: () => {
        return { user: { id: 3, email: "asdf@asdf.com" } };
      },
    },
  ]),
    test("sign in and sign up should not be visible", async () => {
      await renderComponent();
      const signInButton = screen.queryByRole("link", {
        name: /sign in/i,
      });

      const signUpButton = screen.queryByRole("link", {
        name: /sign up/i,
      });

      expect(signInButton).not.toBeInTheDocument();

      expect(signUpButton).not.toBeInTheDocument();
    });

  test("sign out button should be shown", async () => {
    await renderComponent();

    const signOutButton = screen.getByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});
