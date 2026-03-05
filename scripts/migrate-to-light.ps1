# Bulk find-and-replace for dark-to-light migration
$replacements = @(
    @('text-white(?![/])', 'text-foreground'),
    @('bg-black/40', 'bg-card'),
    @('bg-black/60', 'bg-card'),
    @('bg-black/90', 'bg-card'),
    @('bg-black/95', 'bg-card'),
    @('bg-black(?!\s*/)', 'bg-background'),
    @('border-white/10', 'border-border'),
    @('border-white/5', 'border-border'),
    @('bg-white/5', 'bg-muted/50'),
    @('bg-white/10', 'bg-muted'),
    @('divide-white/5', 'divide-border'),
    @('hover:bg-white/5', 'hover:bg-muted'),
    @('hover:bg-white/10', 'hover:bg-muted'),
    @('hover:text-green-400', 'hover:text-primary'),
    @('text-green-400', 'text-primary'),
    @('focus:ring-green-400/50', 'focus:ring-primary/50'),
    @('focus:border-green-400/30', 'focus:border-primary/30'),
    @('group-focus-within:text-green-400', 'group-focus-within:text-primary'),
    @('group-focus-within:border-green-400/30', 'group-focus-within:border-primary/30'),
    @('bg-white/\[0\.03\]', 'bg-muted/50'),
    @('bg-white/\[0\.02\]', 'bg-muted/30'),
    @('focus:bg-white/10', 'focus:bg-muted'),
    @('text-white/20', 'text-border'),
    @('text-white/90', 'text-foreground/90'),
    @('text-white/80', 'text-foreground/80'),
    @('text-white/70', 'text-muted-foreground'),
    @('bg-white/20', 'bg-muted'),
    @('ring-white/20', 'ring-primary/20'),
    @('ring-white/10', 'ring-border'),
    @('hover:text-purple-300', 'hover:text-primary'),
    @('text-purple-400', 'text-primary'),
    @('hover:bg-purple-500/10', 'hover:bg-primary/5'),
    @('text-red-400(?!/)', 'text-destructive'),
    @('hover:text-red-300', 'hover:text-destructive'),
    @('hover:bg-red-500/10', 'hover:bg-destructive/10'),
    @('focus:bg-red-500/10', 'focus:bg-destructive/10'),
    @('focus:text-red-400', 'focus:text-destructive'),
    @('text-emerald-400', 'text-emerald-600'),
    @('border-emerald-500/20', 'border-emerald-200'),
    @('bg-emerald-500/10', 'bg-emerald-50'),
    @('bg-emerald-500/20', 'bg-emerald-50'),
    @('border-emerald-500(?!/)', 'border-emerald-300'),
    @('text-amber-400(?!/)', 'text-amber-600'),
    @('bg-amber-400/10', 'bg-amber-50'),
    @('border-amber-400/20', 'border-amber-200'),
    @('bg-red-400/10', 'bg-red-50'),
    @('border-red-400/20', 'border-red-200'),
    @('text-blue-400', 'text-blue-600'),
    @('bg-blue-400/10', 'bg-blue-50'),
    @('border-blue-400/20', 'border-blue-200'),
    @('text-amber-200/90', 'text-amber-800'),
    @('shadow-\[0_8px_32px_rgba\(0,0,0,0\.5\)\]', 'shadow-sm'),
    @('shadow-\[0_0_15px_rgba\(255,255,255,0\.2\)\]', 'shadow-sm'),
    @('shadow-\[0_0_25px_rgba\(124,58,237,0\.6\)\]', 'shadow-md'),
    @('shadow-\[0_0_20px_rgba\(124,58,237,0\.3\)\]', 'shadow-sm'),
    @('shadow-\[0_0_15px_rgba\(74,222,128,0\.4\)\]', 'shadow-sm'),
    @('shadow-\[0_0_20px_rgba\(124,58,237,0\.4\)\]', 'shadow-md'),
    @('shadow-\[0_0_30px_rgba\(124,58,237,0\.6\)\]', 'shadow-lg'),
    @('shadow-\[0_0_30px_rgba\(0,0,0,0\.5\)\]', 'shadow-md'),
    @('shadow-\[0_0_20px_rgba\(74,222,128,0\.5\)\]', 'shadow-md'),
    @('shadow-\[0_0_15px_rgba\(124,58,237,0\.5\)\]', 'shadow-sm'),
    @('shadow-\[0_0_20px_rgba\(16,185,129,0\.2\)\]', 'shadow-sm'),
    @('shadow-\[0_0_15px_rgba\(124,58,237,0\.4\)\]', 'shadow-sm'),
    @('backdrop-blur-xl', ''),
    @('backdrop-blur-2xl', '')
)

$dirs = @("components", "app")
$count = 0
$projectRoot = "c:\Users\abdel\Desktop\Projects\yallaviral"

foreach ($dir in $dirs) {
    $fullDir = Join-Path $projectRoot $dir
    if (-not (Test-Path $fullDir)) { continue }
    
    Get-ChildItem -Path $fullDir -Recurse -Include "*.tsx", "*.ts" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw -Encoding UTF8
        if ($null -eq $content) { return }
        $original = $content
        
        foreach ($r in $replacements) {
            $content = [regex]::Replace($content, $r[0], $r[1])
        }
        
        # Clean up double spaces from removed backdrop-blur
        $content = $content -replace '\s{2,}(?=")', ' '
        
        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($_.FullName, $content)
            Write-Output ("Updated: " + $_.Name)
            $count++
        }
    }
}

Write-Output "`nTotal files updated: $count"
