import { useForm } from "react-hook-form"

import Input from "../../ui/Input"
import Form from "../../ui/Form"
import Button from "../../ui/Button"

import FormRow from "../../ui/FormRow"
import { useCreateGuest } from "./useCreateGuest"
import { useSearchParams } from "react-router-dom"
import SpinnerMini from "../../ui/SpinnerMini"
import { useEditGuest } from "./useEditGuest"

function CreateGuestForm({ guestToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = guestToEdit
  const isEditSession = Boolean(editId)
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {}
  })
  const { isCreating, createGuest } = useCreateGuest()
  const { isEditing, editGuest } = useEditGuest()
  const { errors } = formState
  const [searchParams, setSearchParams] = useSearchParams()

  const isWorking = isCreating || isEditing

  function onSubmit(data) {
    console.log(data)
    const { email, fullName, nationalID, nationality } = data

    if (editId)
      editGuest(
        { guest: { fullName, email, nationalID, nationality }, id: editId },
        {
          onSuccess: () => {
            reset()
            onCloseModal?.()
          }
        }
      )

    if (!editId)
      createGuest(data, {
        onSuccess: () => {
          searchParams.set("guest", data.email)
          setSearchParams(searchParams)
          onCloseModal?.()
        }
      })
  }

  function onError(errors) {
    console.log(errors)
  }

  return (
    <Form type={onCloseModal ? "modal" : "regular"}>
      <FormRow label={"Full name"} error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isWorking}
          {...register("fullName", {
            required: "This field is required"
          })}
        />
      </FormRow>

      <FormRow label={"Email"} error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address"
            }
          })}
        />
      </FormRow>

      <FormRow label={"National ID"} error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isWorking}
          {...register("nationalID", {
            required: "This field is required"
          })}
        />
      </FormRow>

      <FormRow label={"Nationality (optional)"} error={errors?.nationality?.message}>
        <Input type="text" id="nationality" disabled={isWorking} {...register("nationality")} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button $variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking} onClick={handleSubmit(onSubmit, onError)}>
          {!isWorking ? "Add new guest" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  )
}

export default CreateGuestForm
