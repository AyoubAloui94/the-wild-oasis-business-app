import { useForm } from "react-hook-form"

import Input from "../../ui/Input"
import Form from "../../ui/Form"
import Button from "../../ui/Button"

import FormRow from "../../ui/FormRow"
import { useCreateGuest } from "./useCreateGuest"
import { useSearchParams } from "react-router-dom"
import SpinnerMini from "../../ui/SpinnerMini"
import { useEditGuest } from "./useEditGuest"

import styled from "styled-components"
import { countryList } from "../../utils/constants"

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid ${props => (props.type === "white" ? "var(--color-grey-100)" : "var(--color-grey-300)")};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  width: 100%;
`

function CreateGuestForm({ guestToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = guestToEdit
  const isEditSession = Boolean(editId)
  const { register, handleSubmit, reset, getValues, setValue, formState } = useForm({
    defaultValues: isEditSession ? editValues : {}
  })
  const { isCreating, createGuest } = useCreateGuest()
  const { isEditing, editGuest } = useEditGuest()
  const { errors } = formState
  const [searchParams, setSearchParams] = useSearchParams()

  const isWorking = isCreating || isEditing

  function onSubmit(data) {
    // console.log(data)
    const { email, fullName, nationalID, nationality, countryFlag } = data

    if (editId)
      editGuest(
        { guest: { fullName, email, nationalID, nationality, countryFlag }, id: editId },
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
          searchParams.set("email", data.email)
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
          type="text"
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

      <FormRow label={"Nationality"} error={errors?.nationality?.message}>
        {/* <Input type="text" id="nationality" disabled={isWorking} {...register("nationality")} /> */}
        <StyledSelect
          {...register("nationality", {
            required: "This field is required",
            onChange: e => {
              setValue("countryFlag", `https://flagcdn.com/${countryList.find(country => country.name === e.target.value).code.toLowerCase()}.svg`)
            }
          })}
          id="nationality"
        >
          <option value={""}>-- Select country --</option>
          {countryList.map(country => (
            <option value={country.name} key={country.name}>
              {country.name}
            </option>
          ))}
        </StyledSelect>
      </FormRow>
      <Input hidden id="countryFlag" {...register("countryFlag")} />
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button $variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking} onClick={handleSubmit(onSubmit, onError)}>
          {isWorking ? <SpinnerMini /> : isEditSession ? "Update guest" : "Add new guest"}
        </Button>
      </FormRow>
    </Form>
  )
}

export default CreateGuestForm
