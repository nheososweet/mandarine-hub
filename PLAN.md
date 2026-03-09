# 📋 PLAN: CRUD Base System & DataTable Enhancement

> **Dự án:** Mandarine Hub  
> **Ngày tạo:** 09/03/2026  
> **Mục tiêu:** Xây dựng hệ thống CRUD base chuẩn, nâng cấp DataTable, tạo module demo Expenses  
> **Pattern:** Explicit functions (không factory) — mỗi service/hook là export riêng, rõ ràng, dễ trace

---

## Tổng quan kiến trúc

```
Page (UI)
  └→ useGetExpenses(params)                    // Hook TanStack Query
       └→ hooks/services/expenses.ts           // Hook gọi service function
            └→ GetExpenses(params)             // Service function (explicit export)
                 └→ http.get<Req, Res>(...)    // Axios instance (type-safe)
                      └→ /api/finance/...      // Mock API (Next.js Route Handler)
                           └→ faker data       // Dữ liệu giả lập
```

**Khi có backend thật:** chỉ cần đổi `baseURL` trong `lib/http.ts` + xóa mock route. Không sửa component/hook.

---

## Phase 1: Infrastructure (Nền tảng)

### 1.1 — Cài đặt packages mới

- **Lệnh:** `pnpm add axios @tanstack/react-query @tanstack/react-query-devtools`
- **Trạng thái:** ⬜ Chưa làm

### 1.2 — Update tất cả packages lên latest

- **Lệnh:** `pnpm update --latest`
- **Lưu ý:** Kiểm tra breaking changes sau khi update
- **Trạng thái:** ⬜ Chưa làm

### 1.3 — Tạo Axios instance (`lib/http.ts`)

- **File:** `lib/http.ts`
- **Nội dung:**
  - Tạo Axios instance: `axios.create({ baseURL, headers, timeout })`
  - `baseURL` đọc từ `process.env.NEXT_PUBLIC_API_BASE_URL` (fallback `""` cho mock API)
  - Export `apiVersion` từ `process.env.NEXT_PUBLIC_API_VERSION`
  - **Request interceptor:**
    - Inject `Authorization: Bearer <token>` (placeholder — chưa có auth)
    - Log request URL (dev mode)
  - **Response interceptor:**
    - Success: trả `response.data` trực tiếp (không phải `response`)
    - 401 → placeholder cho redirect login / refresh token
    - 403 → toast "Không có quyền"
    - 404 → toast "Không tìm thấy"
    - Network error → toast "Lỗi mạng"
    - Các lỗi khác → toast message từ server
  - Toast dùng `sonner` (đã có trong project)
  - `export default http`
- **Ví dụ sử dụng:**
  ```typescript
  import http from "@/lib/http";
  http.get<IGetExpensesParams, HttpResponse<IExpense[]>>(
    "/api/finance/expenses?page=1",
  );
  ```
- **Trạng thái:** ⬜ Chưa làm

### 1.4 — Tạo Query Provider

- **File:** `providers/query-provider.tsx`
- **Nội dung:**
  - `"use client"` component
  - Tạo `QueryClient` với config:
    - `staleTime: 5 * 60 * 1000` (5 phút)
    - `gcTime: 10 * 60 * 1000` (10 phút)
    - `retry: 1`
    - `refetchOnWindowFocus: false`
  - Wrap `QueryClientProvider` + `ReactQueryDevtools` (chỉ hiện ở dev)
  - Export `QueryProvider`
- **Trạng thái:** ⬜ Chưa làm

### 1.5 — Tích hợp vào root layout

- **File:** `app/layout.tsx`
- **Nội dung:** Wrap `<QueryProvider>` bọc ngoài children (bên trong `ThemeProvider`)
- **Trạng thái:** ⬜ Chưa làm

---

## Phase 2: Base Types & Service Pattern (Hệ thống types + pattern chuẩn)

> **Lưu ý:** KHÔNG dùng factory pattern. Mỗi entity có file service riêng với các function export rõ ràng.

### 2.1 — Tạo base API types

- **File:** `types/api.ts`
- **Nội dung:**

  ```typescript
  // Response chuẩn bọc data từ API
  export interface HttpResponse<T = unknown> {
    data: T;
    message: string;
    status: "success" | "error";
    status_code: number;
  }

  // Response có phân trang
  export interface HttpPaginatedResponse<T = unknown> extends HttpResponse<
    T[]
  > {
    meta: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }

  // Params phân trang dùng chung
  export interface IBaseParams {
    page: number;
    per_page: number;
    search?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    [key: string]: unknown;
  }

  // Response khi xóa
  export interface IDeleteResponse {
    message: string;
    status: "success" | "error";
    data: boolean;
    status_code: number;
  }
  ```

- **Trạng thái:** ⬜ Chưa làm

### 2.2 — Tạo utility `normalizeString`

- **File:** `utils/normalizeString.ts`
- **Nội dung:**
  - Convert object params thành query string
  - Bỏ qua `undefined`, `null`, `""` values
  - Handle arrays: `category=food&category=transport`
  - Dùng trong service functions: `http.get(\`/endpoint?\${normalizeString(params)}\`)`
- **Trạng thái:** ⬜ Chưa làm

---

## Phase 3: Enhanced DataTable (Nâng cấp bảng dữ liệu)

### 3.1 — Tạo DataTable Skeleton (loading state)

- **File:** `components/ui/data-table/data-table-skeleton.tsx`
- **Nội dung:**
  - Component skeleton hiển thị khi đang load dữ liệu
  - Nhận props: `columnCount`, `rowCount`
  - Dùng `Skeleton` component từ shadcn/ui
  - Responsive theo số cột
- **Trạng thái:** ⬜ Chưa làm

### 3.2 — Tạo Faceted Filter (bộ lọc multi-select)

- **File:** `components/ui/data-table/data-table-faceted-filter.tsx`
- **Nội dung:**
  - Component filter dạng multi-select cho cột enum (status, category...)
  - Props: `column`, `title`, `options[]` (label, value, icon?)
  - UI: Popover + Command (combobox pattern từ shadcn)
  - Hiển thị badge đếm số filter đang active
  - Nút clear filter
- **Trạng thái:** ⬜ Chưa làm

### 3.3 — Tạo Row Actions (hành động theo dòng)

- **File:** `components/ui/data-table/data-table-row-actions.tsx`
- **Nội dung:**
  - Dropdown menu cho mỗi row: Xem / Sửa / Xóa
  - Nhận callback props: `onView`, `onEdit`, `onDelete`
  - Icon cho mỗi action (lucide-react)
  - Separator giữa nhóm actions
  - Có thể extend thêm custom actions
- **Trạng thái:** ⬜ Chưa làm

### 3.4 — Tạo Confirm Dialog

- **File:** `components/ui/confirm-dialog.tsx`
- **Nội dung:**
  - Dialog xác nhận trước khi thực hiện hành động nguy hiểm (xóa...)
  - Props: `title`, `description`, `variant` (danger/warning/info), `onConfirm`, `onCancel`
  - Loading state + disabled trên nút confirm khi đang xử lý (`isLoading` prop)
  - Reusable cho toàn bộ project
- **Trạng thái:** ⬜ Chưa làm

### 3.5 — Nâng cấp DataTable chính

- **File:** `components/ui/data-table/data-table.tsx`
- **Nội dung thêm:**
  - Props mới: `isLoading` → render `DataTableSkeleton`
  - Empty state: icon + text "Không có dữ liệu" (thay vì text plain)
  - **Server-side mode:**
    - `manualPagination`, `manualSorting`, `manualFiltering` (boolean)
    - `pageCount` cho server-side pagination
    - `onPaginationChange`, `onSortingChange` callbacks
  - Giữ nguyên backward-compatible — không truyền thì hoạt động client-side như cũ
- **Trạng thái:** ⬜ Chưa làm

### 3.6 — Nâng cấp Toolbar

- **File:** `components/ui/data-table/data-table-toolbar.tsx`
- **Nội dung thêm:**
  - **Faceted filters slot:** nhận `facetedFilters` array config → render `DataTableFacetedFilter`
  - **Actions slot:** nhận `children` ReactNode (nút Tạo mới, Export... tùy page)
  - **Bulk actions:** hiển thị nút xóa nhiều khi có rows selected, nhận `onBulkDelete` callback
  - **Search debounce:** dùng `ts-debounce` (đã có) hoặc `useCallback` + setTimeout
- **Trạng thái:** ⬜ Chưa làm

### 3.7 — Nâng cấp Pagination

- **File:** `components/ui/data-table/data-table-pagination.tsx`
- **Nội dung thêm:**
  - Nhận `totalRows` prop cho server-side (optional)
  - Hiển thị "Tổng {total} bản ghi" bên cạnh "X of Y selected"
  - Tương thích cả client-side và server-side mode
- **Trạng thái:** ⬜ Chưa làm

---

## Phase 4: Demo Module — Expenses (Quản lý chi tiêu)

### 4.1 — Tạo Expense types

- **File:** `types/expense.ts`
- **Nội dung:**

  ```typescript
  // Interface chính
  export interface IExpense {
    id: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    status: ExpenseStatus;
    date: string; // ISO date
    note?: string;
    created_at: string;
    updated_at: string;
  }

  // Enums
  export type ExpenseCategory =
    | "food"
    | "transport"
    | "entertainment"
    | "bills"
    | "shopping"
    | "other";
  export type ExpenseStatus = "pending" | "completed" | "cancelled";

  // Create/Update form
  export interface ICreateExpense {
    title: string;
    amount: number;
    category: ExpenseCategory;
    status: ExpenseStatus;
    date: string;
    note?: string;
  }
  export type IUpdateExpense = Partial<ICreateExpense>;

  // Query params
  export interface IGetExpensesParams extends IBaseParams {
    category?: ExpenseCategory[];
    status?: ExpenseStatus[];
  }
  ```

- **Zod schema** (trong cùng file hoặc file riêng):
  ```typescript
  export const expenseFormSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được trống"),
    amount: z.number().positive("Số tiền phải lớn hơn 0"),
    category: z.enum([
      "food",
      "transport",
      "entertainment",
      "bills",
      "shopping",
      "other",
    ]),
    status: z.enum(["pending", "completed", "cancelled"]),
    date: z.string().min(1, "Ngày không được trống"),
    note: z.string().optional(),
  });
  export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
  ```
- **Trạng thái:** ⬜ Chưa làm

### 4.2 — Tạo Expense service

- **File:** `services/expenses.ts`
- **Nội dung:**

  ```typescript
  import http from "@/lib/http";
  import {
    HttpPaginatedResponse,
    HttpResponse,
    IDeleteResponse,
  } from "@/types/api";
  import {
    IExpense,
    ICreateExpense,
    IUpdateExpense,
    IGetExpensesParams,
  } from "@/types/expense";
  import { normalizeString } from "@/utils/normalizeString";

  export const GetExpenses = async (params: IGetExpensesParams) => {
    return http.get<IGetExpensesParams, HttpPaginatedResponse<IExpense>>(
      `/api/finance/expenses?${normalizeString(params)}`,
    );
  };

  export const GetExpenseById = async (id: string) => {
    return http.get<unknown, HttpResponse<IExpense>>(
      `/api/finance/expenses/${id}`,
    );
  };

  export const CreateExpense = async (data: ICreateExpense) => {
    return http.post<ICreateExpense, HttpResponse<IExpense>>(
      `/api/finance/expenses`,
      data,
    );
  };

  export const UpdateExpense = async (data: IUpdateExpense, id: string) => {
    return http.put<IUpdateExpense, HttpResponse<IExpense>>(
      `/api/finance/expenses/${id}`,
      data,
    );
  };

  export const DeleteExpense = async (id: string) => {
    return http.delete<IDeleteResponse>(`/api/finance/expenses/${id}`);
  };

  export const DeleteManyExpenses = async (ids: string[]) => {
    return http.post<{ ids: string[] }, IDeleteResponse>(
      `/api/finance/expenses/bulk-delete`,
      { ids },
    );
  };
  ```

- **Trạng thái:** ⬜ Chưa làm

### 4.3 — Tạo Expense query hooks

- **File:** `hooks/services/expenses.ts`
- **Nội dung:**

  ```typescript
  import {
    GetExpenses,
    GetExpenseById,
    CreateExpense,
    UpdateExpense,
    DeleteExpense,
    DeleteManyExpenses,
  } from "@/services/expenses";
  import {
    ICreateExpense,
    IGetExpensesParams,
    IUpdateExpense,
  } from "@/types/expense";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

  export const useGetExpenses = (
    params: IGetExpensesParams,
    enabled = true,
  ) => {
    return useQuery({
      queryKey: ["get-expenses", params],
      queryFn: () => GetExpenses(params),
      enabled,
    });
  };

  export const useGetExpenseById = (id: string, enabled = false) => {
    return useQuery({
      queryKey: ["get-expense-by-id", id],
      queryFn: () => GetExpenseById(id),
      enabled,
    });
  };

  export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["create-expense"],
      mutationFn: CreateExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get-expenses"] });
      },
    });
  };

  export const useUpdateExpense = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["update-expense"],
      mutationFn: (data: IUpdateExpense) => UpdateExpense(data, id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get-expenses"] });
        queryClient.invalidateQueries({ queryKey: ["get-expense-by-id", id] });
      },
    });
  };

  export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["delete-expense"],
      mutationFn: DeleteExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get-expenses"] });
      },
    });
  };

  export const useDeleteManyExpenses = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey: ["delete-many-expenses"],
      mutationFn: DeleteManyExpenses,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get-expenses"] });
      },
    });
  };
  ```

- **Trạng thái:** ⬜ Chưa làm

### 4.4 — Tạo Mock API

- **File:** `app/api/finance/expenses/route.ts`
- **Nội dung:**
  - Dùng `@faker-js/faker` tạo dữ liệu giả, lưu in-memory (mất khi restart server)
  - **GET** — Trả danh sách expenses phân trang
    - Query params: `page`, `per_page`, `sort_by`, `sort_order`, `search`, `category`, `status`
    - Response format: `HttpPaginatedResponse<IExpense>`
  - **POST** — Tạo expense mới → trả `HttpResponse<IExpense>`
  - **PUT** — Cập nhật expense → trả `HttpResponse<IExpense>`
  - **DELETE** — Xóa expense → trả `IDeleteResponse`
- **File:** `app/api/finance/expenses/[id]/route.ts`
  - **GET** — Lấy expense theo id
  - **PUT** — Cập nhật expense theo id
  - **DELETE** — Xóa expense theo id
- **File:** `app/api/finance/expenses/bulk-delete/route.ts`
  - **POST** — Xóa nhiều expenses (nhận `{ ids: string[] }`)
- **Trạng thái:** ⬜ Chưa làm

### 4.5 — Tạo Column definitions

- **File:** `app/(main)/finance/expenses/columns.tsx`
- **Nội dung:**
  - Checkbox column (select row)
  - Title — sortable, filterable
  - Amount — sortable, format tiền tệ (`new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })`)
  - Category — badge với màu theo category
  - Status — badge theo status (pending=vàng, completed=xanh, cancelled=đỏ)
  - Date — sortable, format ngày Việt Nam
  - Actions — `DataTableRowActions` (Xem / Sửa / Xóa)
- **Trạng thái:** ⬜ Chưa làm

### 4.6 — Tạo Expense Form Dialog

- **File:** `app/(main)/finance/expenses/_components/ExpenseFormDialog.tsx`
- **Nội dung:**
  - Dialog dùng cho cả Tạo mới & Chỉnh sửa (nhận `expense?: IExpense` prop)
  - Form fields: title (Input), amount (Input type number), category (Select), status (Select), date (Input type date), note (Textarea)
  - Validation: `react-hook-form` + `@hookform/resolvers/zod` + `expenseFormSchema`
  - Submit gọi `useCreateExpense()` hoặc `useUpdateExpense(id)`
  - Loading state khi submit (`isPending` từ mutation)
  - Toast thông báo: `toast.success("Tạo thành công")` / `toast.error("Có lỗi xảy ra")`
- **Trạng thái:** ⬜ Chưa làm

### 4.7 — Tạo Expenses Page

- **File:** `app/(main)/finance/expenses/page.tsx`
- **Nội dung:**
  - `"use client"` component
  - Page header: tiêu đề + mô tả + nút "Tạo chi tiêu" (mở Dialog)
  - State quản lý: pagination params, selected expense (edit), confirm dialog open
  - Gọi `useGetExpenses(params)` → truyền data + isLoading vào DataTable
  - DataTable server-side mode: `manualPagination`, `pageCount` từ `meta.total_pages`
  - Faceted filters: Category, Status
  - Search debounce theo title
  - Tích hợp `ExpenseFormDialog` (create/edit)
  - Tích hợp `ConfirmDialog` (xóa đơn + xóa nhiều)
  - Bulk delete: `useDeleteManyExpenses()`
- **Trạng thái:** ⬜ Chưa làm

---

## Thứ tự thực hiện

```
Phase 1 (1.1 → 1.5)  ──→  Phase 2 (2.1 → 2.2)  ──→  Phase 3 (3.1 → 3.7)  ──→  Phase 4 (4.1 → 4.7)
     Nền tảng              Base Types & Utils          DataTable                  Demo Module
```

- Mỗi phase **độc lập verify được** sau khi hoàn thành
- Phase 4 phụ thuộc Phase 1 + 2 + 3
- Phase 2 phụ thuộc Phase 1
- Phase 3 có thể làm **song song** với Phase 2

---

## Cấu trúc file khi hoàn thành

```
lib/
  http.ts                                    ← [1.3] Axios instance + interceptors
  utils.ts                                   ← (có sẵn)

providers/
  query-provider.tsx                         ← [1.4] TanStack Query Provider

types/
  api.ts                                     ← [2.1] Base API types (HttpResponse, HttpPaginatedResponse, IBaseParams...)
  expense.ts                                 ← [4.1] IExpense, ICreateExpense, IGetExpensesParams...
  chat.ts                                    ← (có sẵn)
  os.ts                                      ← (có sẵn)

utils/
  normalizeString.ts                         ← [2.2] Object → query string
  file.ts                                    ← (có sẵn)

services/
  expenses.ts                                ← [4.2] GetExpenses, CreateExpense, UpdateExpense...

hooks/
  services/
    expenses.ts                              ← [4.3] useGetExpenses, useCreateExpense, useUpdateExpense...
  use-mobile.ts                              ← (có sẵn)

components/ui/
  confirm-dialog.tsx                         ← [3.4] Confirm dialog
  data-table/
    data-table.tsx                           ← [3.5] Enhanced (loading, empty, server-side)
    data-table-toolbar.tsx                   ← [3.6] Enhanced (faceted filters slot, bulk actions)
    data-table-pagination.tsx                ← [3.7] Enhanced (server-side total)
    data-table-column-header.tsx             ← (có sẵn, giữ nguyên)
    data-table-view-options.tsx              ← (có sẵn, giữ nguyên)
    data-table-skeleton.tsx                  ← [3.1] MỚI
    data-table-faceted-filter.tsx            ← [3.2] MỚI
    data-table-row-actions.tsx               ← [3.3] MỚI

app/api/finance/expenses/
  route.ts                                   ← [4.4] Mock API (GET danh sách, POST tạo mới)
  [id]/route.ts                              ← [4.4] Mock API (GET/PUT/DELETE theo id)
  bulk-delete/route.ts                       ← [4.4] Mock API (POST xóa nhiều)

app/(main)/finance/expenses/
  page.tsx                                   ← [4.7] Trang chính
  columns.tsx                                ← [4.5] Cấu hình cột
  _components/
    ExpenseFormDialog.tsx                    ← [4.6] Form tạo/sửa
```

---

## Quy ước đặt tên

| Loại             | Pattern                         | Ví dụ                                |
| ---------------- | ------------------------------- | ------------------------------------ |
| Interface        | `I{Entity}`                     | `IExpense`, `ICreateExpense`         |
| Type union/enum  | `{Entity}{Field}`               | `ExpenseCategory`, `ExpenseStatus`   |
| Service function | `PascalCase`                    | `GetExpenses`, `CreateExpense`       |
| Hook             | `use{Action}{Entity}`           | `useGetExpenses`, `useCreateExpense` |
| Service file     | `services/{entity}.ts`          | `services/expenses.ts`               |
| Hook file        | `hooks/services/{entity}.ts`    | `hooks/services/expenses.ts`         |
| Type file        | `types/{entity}.ts`             | `types/expense.ts`                   |
| Column defs      | `columns.tsx`                   | `columns.tsx`                        |
| Form dialog      | `{Entity}FormDialog.tsx`        | `ExpenseFormDialog.tsx`              |
| API route        | `route.ts` (Next.js convention) | `route.ts`                           |
| Query key        | `"{action}-{entity}"`           | `"get-expenses"`, `"create-expense"` |

---

## Cách replicate cho module mới

Khi cần thêm module mới (ví dụ: Income, Customers...), chỉ cần:

1. **`types/{entity}.ts`** — Interface + Zod schema
   ```
   IIncome, ICreateIncome, IGetIncomeParams, incomeFormSchema
   ```
2. **`services/{entity}.ts`** — Các export function gọi http
   ```
   GetIncomes, CreateIncome, UpdateIncome, DeleteIncome
   ```
3. **`hooks/services/{entity}.ts`** — Các export hook gọi service
   ```
   useGetIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome
   ```
4. **`columns.tsx`** — Column definitions cho DataTable
5. **`_components/{Entity}FormDialog.tsx`** — Form create/edit
6. **`page.tsx`** — Compose tất cả lại
7. (Nếu chưa có backend) **`app/api/.../route.ts`** — Mock API

**Thời gian ước tính cho module mới: ~30 phút** (vì pattern đã rõ ràng)

---

## Ghi chú

- ⬜ = Chưa làm | 🔄 = Đang làm | ✅ = Hoàn thành
- Khi có backend thật: đổi `baseURL` trong `lib/http.ts`, xóa mock routes
- `framer-motion` và `motion` đang cài trùng → dọn sau
- Pattern service/hook theo style explicit functions — KHÔNG dùng factory/abstract class
