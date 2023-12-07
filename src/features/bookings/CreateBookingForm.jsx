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

const Img = styled.img`
  display: block;
  width: 7.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
  margin-bottom: 2rem;
`

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

function CreateBookingForm({ onCloseModal }) {
  const { cabin, isLoadingCabin } = useCabin()
  const { createBooking, isCreating } = useCreateBooking()
  const { settings, isLoading: isLoadingSettings } = useSettings()

  const { register, handleSubmit, reset, getValues, setValue, formState, control } = useForm()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [searchParams] = useSearchParams()

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

  if (isLoadingCabin || isLoadingSettings) return <Spinner />
  const { id: cabinId, name: cabinName, image, regularPrice, maxCapacity, discount, description } = cabin
  const { breakfastPrice } = settings

  function onSubmit(data) {
    console.log(data)
    createBooking({ data, cabin, breakfastPrice })
  }

  function onError(errors) {
    console.log(errors)
  }

  return (
    <>
      <div>
        <CabinPreview />
      </div>
      <Form onSubmit={handleSubmit(onSubmit, onError)} type={"regular"}>
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
          <AddGuest />
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
          <Button disabled={isCreating}>{!isCreating ? "Create new booking" : <SpinnerMini />}</Button>
        </FormRow>
      </Form>
    </>
  )
}

export default CreateBookingForm
