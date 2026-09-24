export type FormFieldProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  type?: 'text' | 'email' | 'textarea';
  required?: boolean;
  // Not in components.md's FormFieldProps table, but "validating" is a documented
  // state (spinner + "Checking the domain…" hint, on blur only) with no prop to
  // drive it otherwise. Added as the minimal thing needed to satisfy that state.
  // Flagged.
  validating?: boolean;
};

const fieldClasses =
  'w-full rounded border border-ink-500 bg-surface px-3 text-ui text-ink-900 placeholder:text-ink-600 hover:border-ink-600 focus-visible:border-accent aria-invalid:border-1.5 aria-invalid:border-danger';

export function FormField({ name, label, hint, error, type = 'text', required = false, validating = false }: FormFieldProps) {
  const descriptionId = `${name}-description`;
  const description = error ?? (validating ? 'Checking the domain…' : hint);

  const field =
    type === 'textarea' ? (
      // components.md gives 44px as "field height" without distinguishing
      // single-line vs multi-line; a fixed 44px textarea isn't usable, so this uses
      // `rows` instead of a height utility. Flagged as an interpretation.
      <textarea
        id={name}
        name={name}
        rows={5}
        required={required}
        aria-describedby={description ? descriptionId : undefined}
        aria-invalid={Boolean(error) || undefined}
        className={`${fieldClasses} py-3`}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-describedby={description ? descriptionId : undefined}
        aria-invalid={Boolean(error) || undefined}
        className={`${fieldClasses} h-11.5`}
      />
    );

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-caption text-ink-900">
        {label}
      </label>
      <div className="relative">
        {field}
        {validating ? (
          <span aria-hidden="true" className="spinner absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ink-300 border-t-ink-600" />
        ) : null}
      </div>
      {description ? (
        <p id={descriptionId} role={error ? 'alert' : undefined} className="text-caption text-ink-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}
