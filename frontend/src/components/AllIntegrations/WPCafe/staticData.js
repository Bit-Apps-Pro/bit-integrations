import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  {
    label: __('Create Reservation', 'bit-integrations'),
    name: 'create_reservation',
    is_pro: true
  },
  {
    label: __('Update Reservation', 'bit-integrations'),
    name: 'update_reservation',
    is_pro: true
  },
  {
    label: __('Delete Reservation', 'bit-integrations'),
    name: 'delete_reservation',
    is_pro: true
  }
]

export const ReservationFields = [
  { key: 'name', label: __('Name', 'bit-integrations'), required: true },
  { key: 'email', label: __('Email', 'bit-integrations'), required: true },
  { key: 'phone', label: __('Phone', 'bit-integrations'), required: true },
  { key: 'date', label: __('Date', 'bit-integrations'), required: true },
  { key: 'start_time', label: __('Start Time', 'bit-integrations'), required: true },
  { key: 'total_guest', label: __('Total Guest', 'bit-integrations'), required: true },
  { key: 'end_time', label: __('End Time', 'bit-integrations'), required: false },
  { key: 'table_name', label: __('Table Name', 'bit-integrations'), required: false },
  { key: 'branch_id', label: __('Branch ID', 'bit-integrations'), required: false },
  { key: 'branch_name', label: __('Branch Name', 'bit-integrations'), required: false },
  { key: 'notes', label: __('Notes', 'bit-integrations'), required: false },
  { key: 'status', label: __('Status', 'bit-integrations'), required: false }
]

export const ReservationIdField = [
  { key: 'reservation_id', label: __('Reservation ID', 'bit-integrations'), required: true }
]

export const UpdateReservationFields = [
  { key: 'reservation_id', label: __('Reservation ID', 'bit-integrations'), required: true },
  { key: 'name', label: __('Name', 'bit-integrations'), required: false },
  { key: 'email', label: __('Email', 'bit-integrations'), required: false },
  { key: 'phone', label: __('Phone', 'bit-integrations'), required: false },
  { key: 'date', label: __('Date', 'bit-integrations'), required: false },
  { key: 'start_time', label: __('Start Time', 'bit-integrations'), required: false },
  { key: 'end_time', label: __('End Time', 'bit-integrations'), required: false },
  { key: 'total_guest', label: __('Total Guest', 'bit-integrations'), required: false },
  { key: 'table_name', label: __('Table Name', 'bit-integrations'), required: false },
  { key: 'branch_id', label: __('Branch ID', 'bit-integrations'), required: false },
  { key: 'branch_name', label: __('Branch Name', 'bit-integrations'), required: false },
  { key: 'notes', label: __('Notes', 'bit-integrations'), required: false },
  { key: 'status', label: __('Status', 'bit-integrations'), required: false }
]
