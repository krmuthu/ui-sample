The crash persists even with explicit CPU targeting — I need some info from your Linux server to diagnose the root cause. Can you SSH in and run these 3 commands?

Check CPU model and available features:

bash
cat /proc/cpuinfo | grep -E "model name|flags" | head -4
Check if AVX is actually supported:

bash
grep -o 'avx[^ ]*' /proc/cpuinfo | head -5
Check the exact GLIBC version:

bash
ldd --version | head -1
This will tell us whether AVX/AVX2/AVX-512 are actually exposed to the OS (VMs often hide these even when the physical CPU supports them), and whether we need a fully static build.

In the meantime, I'd suggest also trying t
