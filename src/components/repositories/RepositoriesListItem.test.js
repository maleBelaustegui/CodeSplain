import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; 
import RepositoriesListItem from "./RepositoriesListItem";

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "The library for web and native user interfaces.",
    owner: "facebook",
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
  <MemoryRouter>
  <RepositoriesListItem repository={repository} />
  </MemoryRouter>);
}
test("shows the link to github repository", () => {
  renderComponent()
});
