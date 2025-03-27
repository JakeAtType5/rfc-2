import { redirect, type ActionFunctionArgs } from "@shopify/remix-oxygen";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const redirectTo = formData.get("redirectTo") as string;

  if (!redirectTo) {
    return redirect("/");
  }

  // Return a redirect response
  return redirect(redirectTo);
}

// This is needed to prevent the route from loading a page
export async function loader() {
  return redirect("/");
} 