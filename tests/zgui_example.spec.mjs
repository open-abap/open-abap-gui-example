import {test, expect} from "@playwright/test";

const statusMessage = (page) => page.locator(".wb-statusbar #wb-status-message");
const saveButton = (page) => page.locator(".wb-commandbar").getByRole("button", {name: "Save", exact: true});

async function startTransaction(page) {
  await page.goto("/");
  const command = page.getByRole("textbox", {name: "Command"});
  await expect(command).toBeVisible();
  // The workbench command field takes /n followed by the transaction code.
  await command.fill("/nZGUI_EXAMPLE");
  await command.press("Enter");
  await expect(page.locator("[data-page-kind]")).toHaveAttribute("data-page-kind", "DYNPRO");
}

test.describe("ZGUI_EXAMPLE", () => {
  test("the workbench lists the transaction", async ({page}) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/open-abap GUI/);
    await expect(page.getByRole("link", {name: "ZGUI_EXAMPLE"})).toBeVisible();
  });

  test("screen 0100 opens with its default values", async ({page}) => {
    await startTransaction(page);

    await expect(page.getByText("GUI example", {exact: true})).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveValue("");
    await expect(page.getByLabel("City")).toHaveValue("");
    await expect(page.getByLabel("Birth date")).toHaveValue("15.01.1990");
    // Integer output keeps a trailing sign position, as in SAP GUI.
    await expect(page.getByLabel("Quantity")).toHaveValue(/^\s*1\s*$/);
    await expect(page.getByLabel("Active")).toBeChecked();
    await expect(saveButton(page)).toBeEnabled();
  });

  test("Save with a name shows a success message", async ({page}) => {
    await startTransaction(page);

    await page.getByLabel("Name").fill("Lars");
    await page.getByLabel("City").fill("Copenhagen");
    await saveButton(page).click();

    // DATE = USER uses the server's locale; format it the same way as @abaplint/runtime.
    const birthDate = new Intl.DateTimeFormat("default", {day: "2-digit", month: "2-digit", year: "numeric"})
      .format(new Date("1990-01-15T00:00:00"));
    await expect(statusMessage(page)).toHaveText(`Saved Lars, Copenhagen, ${birthDate}, quantity 1`);
    await expect(statusMessage(page)).toHaveClass(/wb-status-success/);
    // The values stay on screen after PAI.
    await expect(page.getByLabel("Name")).toHaveValue("Lars");
    await expect(page.getByLabel("City")).toHaveValue("Copenhagen");
  });

  test("Save without a name shows an error", async ({page}) => {
    await startTransaction(page);

    await saveButton(page).click();

    await expect(statusMessage(page)).toHaveText("Enter a name");
    await expect(statusMessage(page)).toHaveClass(/wb-status-error/);
    await expect(page.locator("[data-page-kind]")).toHaveAttribute("data-page-kind", "DYNPRO");
  });

  test("Back returns to the workbench", async ({page}) => {
    await startTransaction(page);

    await page.locator(".wb-commandbar").getByRole("button", {name: "Back", exact: true}).click();

    await expect(page.locator(".wb-workspace")).toBeVisible();
    await expect(page.locator("[data-page-kind]")).toHaveCount(0);
  });
});
