import Input from "../../ui/Input"
import Form from "../../ui/Form"
import Button from "../../ui/Button"
import FileInput from "../../ui/FileInput"
import Textarea from "../../ui/Textarea"
import { useForm } from "react-hook-form"

import { createCabin } from "../../services/apiCabins"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import FormRow from "../../ui/FormRow"

function CreateCabinForm() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, getValues, formState } = useForm()
  const { errors } = formState

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("New cabin successfully created")
      queryClient.invalidateQueries({ queryKey: ["cabins"] })
      reset()
    },
    onError: error => toast.error(error.message)
  })

  function onSubmit(data) {
    mutate(data)
    // console.log(data)
  }

  function onError(errors) {
    console.log(errors)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label={"Cabin name"} error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required"
          })}
        />
      </FormRow>

      <FormRow label={"Maximum capacity"} error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1"
            }
          })}
        />
      </FormRow>

      <FormRow label={"Regular price"} error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Price cannot be 0"
            }
          })}
        />
      </FormRow>

      <FormRow label={"Discount"} error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: value => Number(value) < Number(getValues().regularPrice) || "Discount cannot exceed the regular price"
          })}
        />
      </FormRow>

      <FormRow label={"Description for website"} error={errors?.description?.message}>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required"
          })}
        />
      </FormRow>

      <FormRow label={"Cabin photo"}>
        <FileInput id="image" accept="image/*" />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  )
}

export default CreateCabinForm
