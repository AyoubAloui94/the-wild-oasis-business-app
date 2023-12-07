import { useForm } from "react-hook-form"

import "react-datepicker/dist/react-datepicker.css"

import Input from "../../ui/Input"
import Form from "../../ui/Form"
import Button from "../../ui/Button"

import FormRow from "../../ui/FormRow"
import { formatCurrency, subtractDates } from "../../utils/helpers"
import styled from "styled-components"
import { useCabin } from "../cabins/useCabin"
import Spinner from "../../ui/Spinner"
import { useSettings } from "../settings/useSettings"
import { useCreateBooking } from "./useCreateBooking"
import Textarea from "../../ui/Textarea"

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
  const { register, handleSubmit, reset, getValues, setValue, formState } = useForm()
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
        <Img src={image} alt={cabinName} />
      </div>
      <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? "modal" : "regular"}>
        <FormRow label={"Start date"} error={errors?.startDate?.message}>
          <Input
            type="date"
            id="startDate"
            min={new Date().toLocaleDateString("fr-ca")}
            disabled={false}
            {...register("startDate", {
              required: "This field is required"
            })}
          />
        </FormRow>

        <FormRow label={"End date"} error={errors?.endDate?.message}>
          <Input
            type="date"
            id="endDate"
            disabled={false}
            {...register("endDate", {
              required: "This field is required",
              validate: value => subtractDates(value, getValues().startDate) > 0 || "Booking duration has to be at least 1 night"
            })}
          />
        </FormRow>

        {/* <FormRow label={"Number of nights"} error={errors?.numNights?.message}>
          <Input type="number" id="numNights" disabled={true} {...register("numNights")} />
        </FormRow> */}

        <FormRow label={"Guest email"} error={errors?.email?.message}>
          <Input type="email" id="email" {...register("email")} />
        </FormRow>

        <FormRow label={`Number of guests (${maxCapacity} max)`} error={errors?.numGuests?.message}>
          <Input
            type="number"
            id="numGuests"
            {...register("numGuests", {
              validate: value => value <= maxCapacity || `Maximum number of guests for this cabin is ${maxCapacity}`
            })}
          />
        </FormRow>

        {/* <FormRow label={"Price"} error={errors?.cabinPrice?.message}>
          <Input type="number" id="cabinPrice" disabled={true} {...register("cabinPrice")} />
        </FormRow> */}

        {/* <FormRow label={"Total Price"} error={errors?.totalPrice?.message}>
          <Input type="number" id="totalPrice" disabled={true} {...register("totalPrice")} />
        </FormRow> */}

        {/* <FormRow>
          <Checkbox id={"hasBreakfast"}>Breakfast? ({formatCurrency(breakfastPrice)}/night)</Checkbox>
          <Input type="number" id="extrasPrice" disabled={true} {...register("extrasPrice")} />
        </FormRow> */}

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
          <Button disabled={false}>{"Create new booking"}</Button>
        </FormRow>
      </Form>
    </>
  )
}

export default CreateBookingForm
