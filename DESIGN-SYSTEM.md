# Design System - CRM Básico

Sistema de diseño de tres capas para el proyecto CRM.

## Arquitectura de Tokens

```
Primitives (valores crudos)
        ↓
Semantic (aliases de propósito)  
        ↓
Component (específicos de componente)
```

## Uso de Tokens

### Colores Semánticos

```css
/* Fondo y texto */
background: var(--color-background);
color: var(--color-foreground);

/* Primario */
background: var(--color-primary);
color: var(--color-primary-foreground);

/* Estados */
background: var(--color-success);
background: var(--color-warning);
background: var(--color-error);
background: var(--color-info);
```

### Tokens de Componentes

```css
/* Button */
--button-primary-bg
--button-primary-bg-hover
--button-primary-fg

/* Input */
--input-border
--input-border-focus
--input-placeholder

/* Card */
--card-bg
--card-border
--card-padding
--card-shadow

/* Badge */
--badge-success-bg
--badge-success-fg
--badge-warning-bg
--badge-warning-fg
--badge-error-bg
--badge-error-fg

/* Sidebar */
--sidebar-bg
--sidebar-active-bg
--sidebar-hover-bg
```

### Con Tailwind

```jsx
// Usando colores extendidos
<div className="bg-primary-600 hover:bg-primary-700" />
<div className="text-success-500" />
<div className="bg-warning-50 text-warning-700" />
<div className="bg-error-600 text-white" />

// Usando spacing
<div className="p-component-md" />
<div className="gap-spacing-lg" />

// Sombras
<div className="shadow-subtle" />
<div className="shadow-strong" />

// Bordes
<div className="rounded-radius-lg" />
```

## Paleta de Colores

### Primary (Blue)
- 50-900: De más claro a más oscuro
- Default: `primary-600` (#2563EB)

### Semantic
| Token | Default | Hover | Muted |
|-------|---------|-------|-------|
| Primary | #2563EB | #1D4ED8 | #EFF6FF |
| Success | #16A34A | #15803D | #F0FDF4 |
| Warning | #F59E0B | #D97706 | #FFFBEB |
| Error | #DC2626 | #B91C1C | #FEF2F2 |
| Info | #0891B2 | #0E7490 | #ECFEFF |

## Dark Mode

El dark mode está habilitado. Agregar la clase `dark` al elemento html activa automáticamente los tokens obscuros.

```html
<html class="dark">
  <!-- Contenido con theme oscuro -->
</html>
```

## Componentes CRM

Los siguientes componentes tienen tokens específicos definidos:

- Button (variantes: default, secondary, ghost, destructive)
- Input
- Card
- Badge
- Avatar
- Table
- Sidebar
- Modal/Dialog
- Tooltip
- Progress
- Select

## Próximos Pasos

1. Migrar componentes existentes para usar tokens CSS
2. Crear tokens específicos para elementos CRM (pipeline, deals, contacts)
3. Agregar animaciones de transición
4. Definir tokens para estados de Deals (ganado, perdido, en progreso)
