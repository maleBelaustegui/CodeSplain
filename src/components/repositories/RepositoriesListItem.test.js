import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RepositoriesListItem from "./RepositoriesListItem";
import { async } from "validate.js";

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "The library for web and native user interfaces.",
    owner: {
      login: "facebook",
    },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );
  return { repository };
}
test("shows the link to github repository", async () => {
  const { repository } = renderComponent();

  await screen.findByRole("img", { name: "Javascript" });

  const link = screen.getByRole("link", {
    name: /github repository/i,
  });
  expect(link).toHaveAttribute("href", repository.html_url);
});

test("should show the correct language Icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", { name: "Javascript" });
  expect(icon).toHaveClass("js-icon");
});

test("should show a link to the code editor page", async () => {
  const { repository } = renderComponent();

  await screen.findByRole("img", { name: "Javascript" });

  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });

  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});
