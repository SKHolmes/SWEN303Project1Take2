foreach dir (`find . -type d -iname "bin" -exec readlink -f {} \;`)
  setenv PATH "${dir}:${PATH}"
end
