import styled from "styled-components"
import { Controller, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { useCabin } from "../cabins/useCabin"
import { useSettings } from "../settings/useSettings"
import { useCreateBooking } from "./useCreateBooking"

import Input from "../../ui/Input"
import Form from "../../ui/Form"
import Button from "../../ui/Button"
import FormRow from "../../ui/FormRow"
import { formatCurrency } from "../../utils/helpers"
import Spinner from "../../ui/Spinner"
import Textarea from "../../ui/Textarea"
import SpinnerMini from "../../ui/SpinnerMini"
import AddGuest from "../guests/AddGuest"
import { useSearchParams } from "react-router-dom"
import CabinPreview from "../cabins/CabinPreview"
import toast from "react-hot-toast"
import { useUpdateBooking } from "./useUpdateBooking"

const StyledCheckbox = styled.div`
  display: flex;
  gap: 1.6rem;

  & input[type="checkbox"] {
    height: 2.4rem;
    width: 2.4rem;
    outline-offset: 2px;
    transform-origin: 0;
    accent-color: var(--color-brand-600);
  }

  & input[type="checkbox"]:disabled {
    accent-color: var(--color-brand-600);
  }

  & label {
    flex: 1;

    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
`

const Label = styled.label`
  font-weight: 500;
`

function CreateBookingForm({ onCloseModal, bookingToEdit = {}, cabin }) {
  const { id: editId, ...editValues } = bookingToEdit
  const isEditSession = Boolean(editId)

  const { createBooking, isCreating } = useCreateBooking()
  const { settings, isLoading: isLoadingSettings } = useSettings()
  const { isUpdating, updateBooking } = useUpdateBooking()

  const { register, handleSubmit, reset, getValues, setValue, formState, control } = useForm({
    defaultValues: isEditSession ? { ...editValues, email: editValues.guests.email, dates: new Date() } : {}
  })

  const [dateRange, setDateRange] = useState(function () {
    if (editId) setValue("dates", [new Date(editValues.startDate), new Date(editValues.endDate)])
    return editId ? [new Date(editValues.startDate), new Date(editValues.endDate)] : [null, null]
  })
  const [startDate, endDate] = dateRange
  const [searchParams] = useSearchParams()

  const isWorking = isCreating || isUpdating

  useEffect(
    function () {
      let defaultValues = {}
      if (searchParams.get("guest")) {
        if (getValues().dates?.length) defaultValues.dates = getValues().dates
        defaultValues.email = searchParams.get("guest").replace("%40", "@")
        reset({ ...defaultValues })
      }
    },
    [searchParams, reset, getValues]
  )

  const { errors } = formState

  if (isLoadingSettings) return <Spinner />
  const { id: cabinId, name: cabinName, image, regularPrice, maxCapacity, discount } = cabin
  const { breakfastPrice } = settings

  function onSubmit(data) {
    console.log(data)
    // if (!data.dates[0] || !data.dates[1]) return toast.error("Please provide a valid date interval")

    if (!editId) createBooking({ data, cabin, breakfastPrice })
    if (editId) {
      updateBooking(
        { data, cabin, breakfastPrice, id: editId },
        {
          onSuccess: () => onCloseModal?.()
        }
      )
    }
  }

  function onError(errors) {
    console.log(errors)
  }

  return (
    <>
      {!isEditSession && (
        <div>
          <CabinPreview />
        </div>
      )}
      <Form onSubmit={handleSubmit(onSubmit, onError)} type={isEditSession ? "modal" : "regular"}>
        <Controller
          name="dates"
          control={control}
          render={({ field }) => {
            return (
              <FormRow label={"Checkin - Checkout"}>
                <ReactDatePicker
                  required
                  minDate={new Date()}
                  autoComplete="off"
                  id="dates"
                  dateFormat={"dd/MM/yyyy"}
                  customInput={<Input />}
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={update => {
                    setDateRange(update)
                    field.onChange(update)
                  }}
                  isClearable={true}
                />
              </FormRow>
            )
          }}
        />

        <FormRow label={"Guest email"} error={errors?.email?.message}>
          <Input
            type="email"
            id="email"
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address"
              }
            })}
          />
          {!isEditSession && <AddGuest />}
        </FormRow>

        <FormRow label={`Number of guests (${maxCapacity} max)`} error={errors?.numGuests?.message}>
          <Input
            type="number"
            id="numGuests"
            {...register("numGuests", {
              required: "This field is required",
              validate: value => (value <= maxCapacity && value > 0) || `Maximum number of guests for this cabin is ${maxCapacity}`
            })}
          />
        </FormRow>

        <FormRow label={"Observations"} error={errors?.observations?.message}>
          <Textarea type="number" id="observations" disabled={false} {...register("observations")} />
        </FormRow>

        <FormRow>
          <StyledCheckbox>
            <Input type="checkbox" id={"hasBreakfast"} {...register("hasBreakfast")} />
            <Label htmlFor="hasBreakfast">Add breakfast? ({formatCurrency(breakfastPrice)}/guest/night)</Label>
          </StyledCheckbox>
        </FormRow>

        <FormRow>
          {/* type is an HTML attribute! */}
          <Button $variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
            Cancel
          </Button>
          {/* <AddGuest /> */}
          <Button disabled={isWorking}>{!isWorking ? `${isEditSession ? "Update booking" : "Create new booking"}` : <SpinnerMini />}</Button>
        </FormRow>
      </Form>
    </>
  )
}

export default CreateBookingForm
