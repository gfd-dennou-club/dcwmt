require "csv"

# カレントディレクトリにnpmがインストールされているかをチェック
raise "Here isn't intalled npm !" if !system("npm -v")

# ライセンス情報のcsvを作成
system("license-checker --prosuction --csv > ./temp.csv")

ary = CSV.read("./temp.csv")
ary.delete_at(0)

file = File.new("LICENSE_LIBURARIES.md", "w")

file.puts("# License for libraries used for DCWMT")
file.puts("")
file.puts("Respective licenses apply for some liburarise, there plugins. Please see the following for the detail.")
file.puts("")

ary.each do |row|
    file.puts("## " + row[0])
    file.puts("repository: " + row[2])
    file.puts("```")
    file.puts(row[1])
    file.puts("```")
    file.puts("")
end

file.close
system("rm -f ./temp.csv")