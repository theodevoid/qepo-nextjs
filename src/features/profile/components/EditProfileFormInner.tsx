import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type EditProfileFormSchema } from "../forms/edit-profile";

type EditProfileFormInnerProps = {
  defaultValues: {
    username?: string;
    bio?: string | null;
  };
};

export const EditProfileFormInner = (props: EditProfileFormInnerProps) => {
  const form = useForm<EditProfileFormSchema>({
    defaultValues: {
      bio: props.defaultValues.bio ?? "",
      username: props.defaultValues.username ?? "",
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};
