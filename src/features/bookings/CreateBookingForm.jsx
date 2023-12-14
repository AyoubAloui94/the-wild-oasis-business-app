import styled from "styled-components"
import { Controller, useForm } from "react-hook-form"
import { useEffect, useMemo, useState } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

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
import { useUpdateBooking } from "./useUpdateBooking"
import { subDays } from "date-fns"

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

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid ${props => (props.type === "white" ? "var(--color-grey-100)" : "var(--color-grey-300)")};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`

function CreateBookingForm({ onCloseModal, bookingToEdit = {}, cabin = {}, cabins = [] }) {
  const { id: editId, ...editValues } = bookingToEdit
  const isEditSession = Boolean(editId)

  const { createBooking, isCreating } = useCreateBooking()
  const { settings, isLoading: isLoadingSettings } = useSettings()
  const { isUpdating, updateBooking } = useUpdateBooking()
  // const { cabins, isLoading: isLoadingCabins } = useCabins()

  const { register, handleSubmit, reset, getValues, setValue, formState, control } = useForm({
    defaultValues: isEditSession ? { ...editValues, email: editValues.guests.email, dates: new Date() } : {}
  })

  const [capacity, setCapacity] = useState("")
  const [selectedCabinId, setSelectedCabinId] = useState("")
  const [selectedCabinExludedDates, setSelectedCabinExcludedDates] = useState(null)

  const [dateRange, setDateRange] = useState(function () {
    if (editId) setValue("dates", [new Date(editValues.startDate), new Date(editValues.endDate)])
    return editId ? [new Date(editValues.startDate), new Date(editValues.endDate)] : [null, null]
  })
  const [startDate, endDate] = dateRange
  const [searchParams] = useSearchParams()

  const isLoading = isLoadingSettings
  const isWorking = isCreating || isUpdating

  useEffect(
    function () {
      let defaultValues = {}
      if (searchParams.get("email")) {
        if (getValues().dates?.length) defaultValues.dates = getValues().dates
        defaultValues.email = searchParams.get("email").replace("%40", "@")
        reset({ ...defaultValues })
      }
    },
    [searchParams, reset, getValues]
  )

  const { errors } = formState

  useEffect(
    function () {
      if (cabin?.id) setCapacity(cabin.maxCapacity)
      if (!cabin?.id) {
        if (!selectedCabinId) {
          setCapacity(cabins[0].maxCapacity)
          setSelectedCabinExcludedDates(
            cabins[0].bookings.map(booking => {
              return { start: new Date(booking.startDate), end: subDays(new Date(booking.endDate), 1) }
            })
          )
        }
        if (selectedCabinId) {
          setCapacity(cabins.find(cabin => cabin.id === Number(selectedCabinId)).maxCapacity)
          setSelectedCabinExcludedDates(
            cabins
              .find(cabin => cabin.id === Number(selectedCabinId))
              .bookings.map(booking => {
                return { start: new Date(booking.startDate), end: subDays(new Date(booking.endDate), 1) }
              })
          )
        }
      }
    },
    [selectedCabinId, cabins, capacity, cabin]
  )

  if (isLoading) return <Spinner />

  const { id: cabinId, name: cabinName, image, regularPrice, maxCapacity, discount } = cabin
  const isCabinSelected = Boolean(cabinId)
  const { breakfastPrice } = settings

  let excludedDates

  if (isCabinSelected || isEditSession) {
    excludedDates = cabin.bookings.map(booking => {
      return { start: new Date(booking.startDate), end: subDays(new Date(booking.endDate), 1) }
    })
  }

  function onSubmit(data) {
    console.log(data)
    // if (!data.dates[0] || !data.dates[1]) return toast.error("Please provide a valid date interval")

    if (!editId && isCabinSelected) createBooking({ data, cabin, breakfastPrice })
    if (!editId && !isCabinSelected) {
      const selectedCabin = cabins.find(cabin => cabin.id === Number(data.cabinId))
      createBooking({ data, cabin: selectedCabin, breakfastPrice })
    }
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
      {!isEditSession && isCabinSelected && (
        <div>
          <CabinPreview />
        </div>
      )}
      <Form onSubmit={handleSubmit(onSubmit, onError)} type={isEditSession ? "modal" : isCabinSelected ? "regular" : "modal"}>
        {!isEditSession && !isCabinSelected && (
          <FormRow label={"Cabin"}>
            <StyledSelect
              defaultValue={cabins[0].id}
              id={"cabinId"}
              {...register("cabinId", {
                required: "This field is required",
                onChange: e => {
                  setSelectedCabinId(e.target.value)
                }
              })}
            >
              {cabins.map(cabin => (
                <option key={cabin.id} value={cabin.id}>
                  {cabin.name} &mdash; {cabin.maxCapacity} people max
                </option>
              ))}
            </StyledSelect>
          </FormRow>
        )}
        <Controller
          name="dates"
          control={control}
          render={({ field }) => {
            return (
              <FormRow label={"Checkin - Checkout"}>
                <ReactDatePicker
                  required
                  excludeDateIntervals={excludedDates || selectedCabinExludedDates}
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
            type="text"
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

        <FormRow label={`Number of guests (${capacity} max)`} error={errors?.numGuests?.message}>
          <Input
            type="number"
            id="numGuests"
            {...register("numGuests", {
              required: "This field is required",
              validate: value => (value <= capacity && value > 0) || `Maximum number of guests for this cabin is ${capacity}`
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
